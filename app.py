from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    avatar = db.Column(db.String(256), default='default_avatar.png')
    total_games = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    theme = db.Column(db.String(20), default='classic')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class GameRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    time_used = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref=db.backref('records', lazy=True))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    login_manager.login_message = '请先登录'
    
    register_routes(app)
    
    return app


def register_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            if User.query.filter_by(username=username).first():
                flash('用户名已存在')
                return redirect(url_for('register'))
            
            user = User(username=username)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            
            flash('注册成功，请登录')
            return redirect(url_for('login'))
        
        return render_template('register.html')
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            user = User.query.filter_by(username=username).first()
            if user and user.check_password(password):
                login_user(user)
                return redirect(url_for('index'))
            
            flash('用户名或密码错误')
        
        return render_template('login.html')
    
    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('index'))
    
    @app.route('/profile')
    @login_required
    def profile():
        return render_template('profile.html')
    
    @app.route('/api/save_record', methods=['POST'])
    @login_required
    def save_record():
        data = request.get_json()
        difficulty = data.get('difficulty')
        time_used = data.get('time_used')
        
        current_user.total_games += 1
        current_user.wins += 1
        
        record = GameRecord(
            user_id=current_user.id,
            difficulty=difficulty,
            time_used=time_used
        )
        
        db.session.add(record)
        db.session.commit()
        
        return jsonify({'success': True})
    
    @app.route('/api/leaderboard/<difficulty>')
    def get_leaderboard(difficulty):
        records = GameRecord.query.filter_by(difficulty=difficulty)\
            .order_by(GameRecord.time_used)\
            .limit(10)\
            .all()
        
        result = []
        for r in records:
            result.append({
                'username': r.user.username,
                'time_used': r.time_used,
                'created_at': r.created_at.strftime('%Y-%m-%d %H:%M')
            })
        
        return jsonify(result)
    
    @app.route('/api/set_theme', methods=['POST'])
    @login_required
    def set_theme():
        data = request.get_json()
        current_user.theme = data.get('theme')
        db.session.commit()
        return jsonify({'success': True})
    
    @app.route('/api/get_theme')
    def get_theme():
        if current_user.is_authenticated:
            return jsonify({'theme': current_user.theme})
        return jsonify({'theme': 'classic'})


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
