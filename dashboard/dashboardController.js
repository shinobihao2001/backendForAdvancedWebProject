const express = require("express");
const Classes = require("../class/classModel");

exports.loadListClasses = async (req, res) => {
  const listClass = await Classes.find();
  res.status(200).json(listClass);
};

exports.addClass = async (req, res) => {
  const { classname, classOwner, describle } = req.body;

  const newClass = new Classes({
    classname: classname,
    classOwner: classOwner,
    describle: describle,
  });
  await newClass.save();

  //return
  console.log("Add new class successfully!");
  res.status(200);
};
