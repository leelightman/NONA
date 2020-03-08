import os

from flask import Flask, render_template


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

    @app.route('/build')
    def build():
        return render_template('build-frame.html')

    @app.route('/embed')
    def embed():
        return render_template('build-embed.html')

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

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)
    
    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/blog', endpoint='blog.index')

    return app
