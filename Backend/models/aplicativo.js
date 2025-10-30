'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Aplicativo extends Model {
    static associate(models) {

      Aplicativo.hasMany(models.Instalador, { 
        foreignKey: 'aplicativoId',
        as: 'instaladores',
        onDelete: 'CASCADE',
      });
    }
  }

  Aplicativo.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      version_actual: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Aplicativo',
      tableName: 'aplicativos', 
      timestamps: true, 
    }
  );

  return Aplicativo;
};