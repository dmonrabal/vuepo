exports.messages = {
  // Project messages
  PROJECT_CREATE_SUCCESS: 'Proyecto creado con éxito.',
  PROJECT_UPDATE_SUCCESS: 'Proyecto actualizado con éxito',
  PROJECT_DELETE_SUCCESS: 'Proyecto eliminado con éxito',

  PROJECT_CREATE_ERROR: 'Error al crear proyecto.',
  PROJECT_UPDATE_ERROR: 'Error al actualizar proyecto.',
  PROJECT_DELETE_ERROR: 'Error al eliminar proyecto.',

  // Group messages
  GROUP_CREATE_SUCCESS: 'Grupo creado con éxito.',
  GROUP_UPDATE_SUCCESS: 'Grupo actualizado con éxito',
  GROUP_DELETE_SUCCESS: 'Grupo eliminado con éxito',

  GROUP_CREATE_ERROR: 'Error al crear grupo.',
  GROUP_UPDATE_ERROR: 'Error al actualizar grupo.',
  GROUP_DELETE_ERROR: 'Error al eliminar grupo.',

  // Device messages
  DEVICE_CREATE_SUCCESS: 'Dispositivo creado con éxito.',
  DEVICE_UPDATE_SUCCESS: 'Dispositivo actualizado con éxito',
  DEVICE_DELETE_SUCCESS: 'Dispositivo eliminado con éxito',

  DEVICE_CREATE_ERROR: 'Error al crear dispositivo.',
  DEVICE_UPDATE_ERROR: 'Error al actualizar dispositivo.',
  DEVICE_DELETE_ERROR: 'Error al eliminar dispositivo.',

  // Sensor messages
  SENSOR_CREATE_SUCCESS: 'Sensor creado con éxito.',
  SENSOR_UPDATE_SUCCESS: 'Sensor actualizado con éxito',
  SENSOR_DELETE_SUCCESS: 'Sensor eliminado con éxito',

  SENSOR_CREATE_ERROR: 'Error al crear el sensor.',
  SENSOR_UPDATE_ERROR: 'Error al actualizar el sensor.',
  SENSOR_DELETE_ERROR: 'Error al eliminar el sensor.',

  // User messages
  USER_CREATE_SUCCESS: 'Usuario creado con éxito.',
  USER_UPDATE_SUCCESS: 'Usuario actualizado con éxito',
  USER_DELETE_SUCCESS: 'Usuario eliminado con éxito',

  USER_CREATE_ERROR: 'Usuario al crear el sensor.',
  USER_UPDATE_ERROR: 'Usuario al actualizar el sensor.',
  USER_DELETE_ERROR: 'Usuario al eliminar el sensor.',

  USER_IMGUPD_SUCCESS: 'Imagen actualizada con éxito.',
  USER_IMGUPD_ERROR: 'Fallo al actualizar la imagen.',
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

exports.padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
};

exports.formatDate = (date) => {
  return (
    [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes()),
      this.padTo2Digits(date.getSeconds()),
    ].join(':')
  );
  
};
