/*
Allows loading of a template from an external file
    e.g:    var template = Handlebars.getTemplate("social-tint-tiles", '/workspace/views/admin/social-tint-tiles/social-tint-tiles.handlebars');
            var html    = template(result);
*/
Handlebars.getTemplate = function(name, path) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url : path,
            success : function(data) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                Handlebars.templates[name] = Handlebars.compile(data);
            },
            async : false
        });
    }
    return Handlebars.templates[name];
};


/* Allows more versatile if statements in template logic */
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

/* Lowercase */
Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

/* Accepts a unix timestamp and returns relative time as a string. e.g 1 day ago */
Handlebars.registerHelper('timeAgo', function(previous) {

  previous = previous*1000; //convert to milliseconds
  var current = Date.now();

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  var duration = 0;
  var unit = "";

  if (elapsed < msPerMinute) {
      duration = Math.round(elapsed/1000);
      unit = 'second';
  }
  else if (elapsed < msPerHour) {
    duration = Math.round(elapsed/msPerMinute);
    unit = 'minute';
  }
  else if (elapsed < msPerDay ) {
       duration = Math.round(elapsed/msPerHour );
       unit = 'hour';
  }
  else if (elapsed < msPerMonth) {
      duration = Math.round(elapsed/msPerDay);
      unit = 'day';
  }
  else if (elapsed < msPerYear) {
      duration = Math.round(elapsed/msPerMonth);
      unit = 'month';
  }
  else {
      duration = Math.round(elapsed/msPerYear );
      unit = 'year';
  }
  //Add plural if it's larger than 1 .
  if(duration>1) {
    unit = unit+'s';
  }

  return duration+' '+unit+' ago';

});
