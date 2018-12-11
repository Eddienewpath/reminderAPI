Promise.reject(new Error('fail')).then(function(error) {
    console.log(error); // Stacktrace
  });