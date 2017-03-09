var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon  = require('gulp-nodemon');


/*
* sass compilation task
**********************/
gulp.task('sass', function() {
    gulp.src(['./public/scss/app.scss','./public/scss/response.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'))
});

/*
* nodemon task
*********************************/
gulp.task('nodemon',function(cb){
  var called = false;
  var initialized = false;
  return nodemon({
    script:'./bin/www',
    ext:'js',
    watch:['./routes/','./controllers/','./models/','./bin'],
    legacyWatch:true,
  });
})

gulp.task('sass:watch',function(){
    gulp.watch('./public/scss/*.scss',['sass']);
})


/*
* defaul task -  nodemon and sass:watch
*******************************************************/
gulp.task('default',['nodemon','sass:watch']);
