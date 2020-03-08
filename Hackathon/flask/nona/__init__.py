import os

from flask import Flask, render_template, request, g, redirect, url_for

from nona.db import get_db


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # -
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/temp')
    def temp():
        return render_template('temp.html')

    @app.route('/avatar/embed')
    def embed():
        return render_template('avatar/embed.html')

    @app.route('/shop')
    def shop():
        return render_template('shop.html')

    @app.route('/cart')
    def cart():
        return render_template('cart.html')

    @app.route('/checkout')
    def checkout():
        return render_template('checkout.html')

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/shopsingle')
    def shopsingle():
        return render_template('shop-single.html')

    @app.route('/thankyou')
    def thankyou():
        return render_template('thankyou.html')

    @app.route('/categories')
    def categories():
        return render_template('categories.html')

    @app.route('/lookbook')
    def lookbook():
        return render_template('lookbook.html')
    
    @app.route('/save')
    def save():
        body_height  = request.args.get('body_height', default=None, type=int)
        body_weight  = request.args.get('body_weight', default=None, type=int)
        skin_tone  = request.args.get('skin_tone', default=None, type=str)
        sex  = request.args.get('sex', default=None, type=str)
        error = None
        
        if not body_height:
            error = 'body_height is required.'
        if not body_weight:
            error = 'body_weight is required.'
        if not skin_tone:
            error = 'skin_tone is required.'
        if not sex:
            error = 'sex is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO avatar (body_height, body_weight, skin_tone, sex, owner_id)'
                ' VALUES (?, ?, ?, ?, ?)',
                (body_height, body_weight, skin_tone, sex, g.user['id'])
            )
            db.commit()
            return redirect(url_for('avatar.index'))

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)
    
    from . import avatar
    app.register_blueprint(avatar.bp)
    app.add_url_rule('/avatar', endpoint='avatar.index')

    return app
