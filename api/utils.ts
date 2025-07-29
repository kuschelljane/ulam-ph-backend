export const shuffle = <T>(array: T[]): T[] => {
    const result = [...array]; 
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    return result;
}

export const getRandomItems = (meals: any[], category: string, count: number) => {
    const filtered = meals.filter(meal => meal.category.toLowerCase() === category.toLowerCase());

    if (filtered.length < count) {
        throw new Error(`Not enough meals in category: ${category}`);
    }

    return shuffle(filtered).slice(0, count); 
}