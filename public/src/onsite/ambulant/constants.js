var eventInfo
var surveys

$('input[name="prcExpiry"]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  minYear: parseInt(moment().format('YYYY'),10),
  maxYear: parseInt(moment().add(20, 'years').format('YYYY'),10),
  locale: {
    format: 'YYYY-MM-DD'
  },
  showButtonPanel: false,
  drops: "auto",
});
