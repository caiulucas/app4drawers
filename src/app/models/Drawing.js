/* eslint-disable no-param-reassign */
module.exports = (sequelize, DataTypes) => {
  const Drawing = sequelize.define(
    'Drawing',
    {
      description: DataTypes.STRING,
      drawing: DataTypes.VIRTUAL,
      drawing_url: DataTypes.STRING,
    },
    {
      hooks: {
        beforeSave: (drawing) => {
          if (drawing.drawing) {
            drawing.drawing_url = `${process.env.APP_URL}/images/drawings/${drawing.drawing}`;
          }
        },
      },
    }
  );

  return Drawing;
};
