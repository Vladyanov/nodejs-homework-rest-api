const express = require("express");
const Joi = require("joi");

const router = express.Router();

const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers/");

const addSchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.empty": `"name" cannot be an empty field`,
    "any.required": `"name" is a required field`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required()
    .messages({
      "string.empty": `"email" cannot be an empty field`,
      "any.required": `"email" is a required field`,
    }),
  phone: Joi.string().min(5).max(20).required().messages({
    "string.empty": `"phone" cannot be an empty field`,
    "string.min": `"phone" should have a minimum length of {#limit}`,
    "string.max": `"phone" should have a maximum length of {#limit}`,
    "any.required": `"phone" is a required field`,
  }),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { id } = req.params;
    console.log(id);
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
