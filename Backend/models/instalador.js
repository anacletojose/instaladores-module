'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Instalador extends Model {
    static associate(models) {

      Instalador.belongsTo(models.Aplicativo, { 
        foreignKey: 'aplicativoId',
        as: 'aplicativo', 
      });

      Instalador.belongsTo(models.Usuario, { 
        foreignKey: 'usuarioId',
        as: 'usuario', 
      });
    }
  }

  Instalador.init(
    {
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      archivo_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fecha_carga: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      aplicativoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Instalador',
      tableName: 'instaladores',
      timestamps: true,
    }
  );

  return Instalador;
};
