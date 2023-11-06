const router = require('express').Router();
const { User, Project } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const projectData = await Project.findAll({
      attributes: { exclude: ['id', 'description', 'user_id'] },
      order: [['name', 'ASC']],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));

    res.status(200).render('homepage', { projects });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const projectData = await Project.findAll({
      where: { user_id: req.user.id},
      attributes: { exclude: ['description'] },
      order: [['name', 'ASC']],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));

    res.render('profile', { projects });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: [
            'name',
            'email'
          ]
        }
      ],
      order: [['name', 'ASC']],
    });

    const project = projectData.get({ plain: true });

    res.render('project', { project });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {

  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
