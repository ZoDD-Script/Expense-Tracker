import moment from "moment";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  return name.match(/\b\w/g).slice(0, 2).join("");
};

export const addThousandSeparator = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// export const addThousandSeparator = (number) => {
//   if (number == null || isNaN(number)) return "";

//   const [intergerPart, fractionalPart] = number.toString().split(".");
//   const fromattedInteger = intergerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   return fractionalPart
//     ? `${fromattedInteger}.${fractionalPart}`
//     : fromattedInteger;
// };

export const prepareExpenseBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};
