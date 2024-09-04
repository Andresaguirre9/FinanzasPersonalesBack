module.exports = {
  async getUser(req, res) {
    try {
      const userId = req.session.userId; // Esto depende de cómo manejes las sesiones

      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const user = await Login.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};
