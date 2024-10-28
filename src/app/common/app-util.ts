export class AppUtil{
    optionForDropDown: any;

    public static deepCopy(d:any){
        return JSON.parse(JSON.stringify(d));
    }
    // Validate Numbers
    public static validateNumbers(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      // Only Numbers 0-9
      if ((charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
    // Validate Alphanumeric
    public static validateAlphanumeric(event) {
      var keyCode = event.keyCode || event.which;
            var regex = /^[a-zA-Z0-9.\s]+$/;
            var isValid = regex.test(String.fromCharCode(keyCode));
            if (!isValid) {
              event.preventDefault();
              return false;
            }

            return isValid;
    }
    //Validate only number with decimal
    public static validateNumbersWithDecimal(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
      return true;
    }
    public static validateEmial(event){
      var email = String.fromCharCode(event.keyCode);
      var emailReg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if(!emailReg.test(email)) {
        event.preventDefault();
        return false;
      }else{
        return true;
      }
    }

    public static convertSTRtoDate(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
        // UI_CONSTANT.SHORT_DATE_FORMAT
      return [day,mnth,date.getFullYear()].join("/");
    }

    public static generateArrayOfYears() {
      var max = new Date().getFullYear()
      var min = max - 10
      var years = []
    
      for (var i = max; i >= min; i--) {
        years.push(i)
      }
      return years
    }
    //validate number with decimal
    public static validateDecimalNumbers(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      // Only Numbers 0-9
      if ((charCode < 48 || charCode > 57) && charCode != 46) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
    public static getLongDate(month,year){
      var months = new Date(`${month} 1, ${year}`).getMonth() + 1;
      var monthNumber = months >9 ? months: '0'+months;
      const datetime = year+'-'+monthNumber+'-01T00:00:00';
      return datetime;
     }
}
