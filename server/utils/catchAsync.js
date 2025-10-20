const catchAsync = (fn) => { // ვქმნით ფუნქციას სახელად catchAsync ამ ფუნქციის დახმარებით ჩვენ შეგვიძლია რომ დავიჭიროთ error - ები ასინქრონული ფუნქციებიდან
    return (req, res, next) => { // როდესაც მომხმარებელი გააგზავნის ახალ მოთხოვნას ვიძახებთ ფუნქციას რომელსაც გადაეცემა სამი არგუმენტი req, res, next
        fn(req, res, next).catch(next); // იმ შემთხვევაში თუ error - ი დაფიქსირდა catch ამ error - ს გადასცემს next ფუნციას
    }
}   

module.exports = catchAsync; // ვა - export - ებთ catchAsync - ფუნქციას