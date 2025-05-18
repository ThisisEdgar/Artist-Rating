import React, { useState, useEffect } from 'react';
import { createArray } from "../services/createArray";
import Star from "./star";

const StarRating = ({ totalStars = 5, actualRating, handleRatingChange = f => f }) => {
    const [selectedStars, setSelectedStars] = useState(actualRating);
    useEffect(() => {
        setSelectedStars(actualRating);
    }, [actualRating]);

    return (
        <>
            {createArray(totalStars).map((e, i) => (
                <Star
                    key={i}
                    selected={selectedStars > i}
                    onSelect={() => {
                        setSelectedStars(i + 1);
                        handleRatingChange(i + 1);
                    }}
                />
            ))}
            <p>{selectedStars} of {totalStars} selected</p>
        </>
    );
};

export default StarRating;