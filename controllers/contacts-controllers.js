const { ctrlWrapper } = require("../utils");

const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };
  if (favorite) {
    query.favorite = favorite;
  }

  const result = await Contact.find(query, "", {
    skip,
    limit,
    favorite,
  }).populate("owner", "name email");

  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  // const result = await Contact.findOne({ _id: id });
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json({ message: "Contact deleted" });
};

const updateContactById = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(400, "missing field favorite");
  }
  res.json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContactById: ctrlWrapper(updateContactById),
  updateFavorite: ctrlWrapper(updateFavorite),
};
