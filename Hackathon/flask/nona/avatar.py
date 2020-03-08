from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from nona.auth import login_required
from nona.db import get_db

bp = Blueprint('avatar', __name__)

@bp.route('/')
@login_required
def index():
    db = get_db()
    avatar = db.execute(
        'SELECT p.id, body_height, body_weight, skin_tone, sex, created, owner_id, username'
        ' FROM avatar p JOIN user u ON p.owner_id = u.id'
        ' ORDER BY created DESC'
    ).fetchone()
    
    if avatar:
        return render_template('avatar/index.html', avatar=avatar)
    else:
        return render_template('avatar/create.html')

@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        body_height = request.form['body_height']
        body_weight = request.form['body_weight']
        skin_tone = request.form['skin_tone']
        sex = request.form['sex']
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

    return render_template('avatar/create.html')

# def get_avatar(id, check_author=True):
#     avatar = get_db().execute(
#         'SELECT p.id, body_height, body_weight, created, owner_id, username'
#         ' FROM avatar p JOIN user u ON p.owner_id = u.id'
#         ' WHERE p.id = ?',
#         (id,)
#     ).fetchone()

#     if avatar is None:
#         abort(404, "avatar id {0} doesn't exist.".format(id))

#     if check_author and avatar['owner_id'] != g.user['id']:
#         abort(403)

#     return avatar

@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    avatar = get_avatar(id)

    if request.method == 'POST':
        body_height = request.form['body_height']
        body_weight = request.form['body_weight']
        skin_tone = request.form['skin_tone']
        sex = request.form['sex']
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
                'UPDATE avatar SET body_height = ?, body_weight = ?, skin_tone = ?,'
                'sex = ? WHERE id = ?',
                (body_height, body_weight, skin_tone, sex, id)
            )
            db.commit()
            return redirect(url_for('avatar.index'))

    return render_template('avatar/update.html', avatar=avatar)

@bp.route('/<int:owner_id>/delete', methods=('POST',))
@login_required
def delete(owner_id):
    # get_avatar(id)
    db = get_db()
    db.execute('DELETE FROM avatar WHERE owner_id = ?', (owner_id,))
    db.commit()
    return redirect(url_for('avatar.index'))
