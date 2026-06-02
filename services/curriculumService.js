import { CURRICULUM } from "../data/curriculum";

export function getLessons(subject,grade,trimester) {

    return (
        CURRICULUM?.[subject]?.[grade]?.[trimester] || []
    );

}