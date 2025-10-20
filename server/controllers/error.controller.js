const sendErrorDevelopment = (err, res) => { // ვქმნით ფუნქციას სახელად sendErrorDevelopment რომელსაც გადაეცემა ორი არგუმენტი err, res ობიექტები
    res.status(err.statusCode).json({ // ვგზავნით პასუხს status - ის კოდით და json ({}) - ში ჩაწერილი ინფორმაციით
        status: err.status, // status - ი
        message: err.message, // error - ის message
        stack: err.stack, // ვრცელი ინფორმაცია
        error: err // err - ის ობიექტი
    });
};

const sendErrorProduction = (err, res) => { // ვქმნით ფუნქციას სახელად sendErrorProduction რომელსაც გადაეცემა ორი არგუმენტი err, res ობიექტები
    res.status(err.statusCode).json({ // აქაც ანალოგიურად ვუგზავნით პასუხს client - ს err - ის statusCode - ით და json ({}) - ში ჩაწერილი ინფორმაციით
        status: err.status, // error - ის status - ი
        message: err.message || 'Something went wrong' // error ობიექტში არსებული message - ი ან Something went wrong
    });
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // იმ შემთხვევაში თუ გვაქვს statusCode - კუთვნილება ვინახავთ err.statusCode - ს სხვა დანარჩენ შემთხვევაში კი 500 - ს 
    err.status = err.status || 'fail'; // თუ გვაქვს status - კუთვნილება ვინახავთ err.status - ს, თუ არ გვაქვს fail - ს

    if(process.env.NODE_ENV === 'dev'){ // ვამოწმებთ თუ env ფაილში არსებული გარემოს ცვლადის NODE_ENV - მნიშვნელობა უდრის development - ს
        // რაც იმას ნიშნავს რომ პროექტი ჯერ კიდევ არ დასრულებულა
        return sendErrorDevelopment(err, res); // მაშინ ვაბრუნებთ sendErrorDevelopment ფუნქციას
    } else{
        return sendErrorProduction(err, res); // სხვა შემთხვევაში კი sendErrorProduction ფუნქციას
    }
}

module.exports = globalErrorHandler; // ვა - export - ებთ globalErrorHandler - ფუნქციას