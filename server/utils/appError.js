class AppError extends Error { // ვქმნით class - ს სახელად AppError რომელსაც ვაფართოვებთ Error - ის ობიექტთან
    constructor(message, statusCode) { // constructor - ს გადაეცემა ორი მნიშვნელობა message, statusCode
        super(message); // მშობელი Error კლასიდან ვიღებთ message კუთვნილებას
        this.statusCode = statusCode; // ვქმნით კუთვნილებას statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // ვქმნით კუთვნილებას status მასში ვაკეთებთ შემოწმებას
        // ვამოწმებთ თუ statusCode - ის მნიშვნელობა იწყება 4 - ით მაშინ status კუთვნილებას ვანიჭბთ მნიშვნელობას fail სხვა შემთხვევაში კი error

        this.isOperational = true; // ვქმნით კუთვნილებას isOperational რომლის მნიშვნელობაც არის true

        Error.captureStackTrace(this, this.constructor); // ამ კოდის დახმარებით ჩვენ შეგვიძლია რომ გავიგოთ თუ კონკრეტულად სად მოხდა error - ი
    }
}

module.exports = AppError; // ვა - export - ებთ AppError class - ს