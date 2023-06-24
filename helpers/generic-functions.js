const validator = require('validator');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? +page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, totalPages, currentPage, items };
};

const isMobilePhone = (phoneNumber) => {
  return validator.isMobilePhone(phoneNumber);
};

module.exports = { getPagination, getPagingData, capitalize, isMobilePhone };
