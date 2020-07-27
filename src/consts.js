// Allowed column names in order
export const EXPECT_HEADER=["patient_mrn","delivery_date","counseling","contraception_choice","immediate_method",
                             "contraception_provision","larc_provision","payer","choice_date","peripartum_care"]

// Allowed values for columns
export const VALID_VALS = {
  counseling:      ["yes","no","unknown"],
  contraception_choice:   ["immediate pp iud", "immediate pp nexplanon", "pptl", "other", "none", "unknown"],
  immediate_method:      ["immediate pp iud", "immediate pp nexplanon", "pptl", "other", "none", "unknown"],
  contraception_provision:     ["0-3 days", "4-60 days", "not provisioned", "unknown"],
  larc_provision:       ["0-3 days", "4-60 days pp visit","4-60 days not pp visit", "not provisioned", "unknown"],
  payer:           ["medicaid", "molina", "private", "other", "unknown"],
  peripartum_care: ["yes","no","unknown"]
};


export const COUNSELING = ["yes","no","unknown"];
export const CONTRACEPTION_CHOICE = ["immediate pp iud", "immediate pp nexplanon", "pptl", "other", "none", "unknown"];
export const IMMEDIATE_METHOD = ["immediate pp iud", "immediate pp nexplanon", "pptl", "other", "none", "unknown"];
export const CONTRACEPTION_PROVISION = ["0-3 days", "4-60 days", "not provisioned", "unknown"];
export const LARC_PROVISION = ["0-3 days", "4-60 days pp visit","4-60 days not pp visit", "not provisioned", "unknown"];
export const PAYER = ["medicaid", "molina", "private", "other", "unknown"];
export const PERIPARTUM_CARE = ["yes","no","unknown"];

// Allowed date format
export const DATE_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

export const XLSX_ERROR = {
  name: "Excel Input Error",
  message: "Input file is an Excel xlsx or xlsb.  This tool can only handle csv files."};
