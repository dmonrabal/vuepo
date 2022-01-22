exports.messages = {
  // Group messages
  GROUP_CREATE_SUCCESS: 'Grupo creado con éxito.',
  GROUP_UPDATE_SUCCESS: 'Grupo actualizado con éxito',
  GROUP_DELETE_SUCCESS: 'Grupo eliminado con éxito',

  GROUP_CREATE_ERROR: 'Error al crear grupo.',
  GROUP_UPDATE_ERROR: 'Error al crear grupo.',
  GROUP_DELETE_ERROR: 'Error al actualizar grupo.',
};

exports.alert = (alert, type, message) => {
  alert.type = type;
  alert.text = message;
  alert.enable = true;

  setTimeout(() => {
    alert.enable = false;
    alert.type = 'success';
    alert.text = '';
  }, 5000);
};
