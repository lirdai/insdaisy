import React, { useState } from 'react'
import LenaJS from "lena.js"



const DEFAULT_OPTIONS = [
    {
        name: "Brightness",
        property: "brightness",
        value: 100,
        range: {
            min: 0,
            max: 200
        },
        unit: "%"
    },
    {
        name: "Contrast",
        property: "contrast",
        value: 100,
        range: {
            min: 0,
            max: 200
        },
        unit: "%"
    },
    {
        name: "Saturation",
        property: "saturate",
        value: 100,
        range: {
            min: 0,
            max: 200
        },
        unit: "%"
    },
    {
        name: "Grayscale",
        property: "grayscale",
        value: 0,
        range: {
            min: 0,
            max: 100
        },
        unit: "%"
    },
    {
        name: "Sepia",
        property: "sepia",
        value: 0,
        range: {
            min: 0,
            max: 100
        },
        unit: "%"
    },
    {
        name: "Hue Rotate",
        property: "hue-rotate",
        value: 0,
        range: {
            min: 0,
            max: 360
        },
        unit: "deg"
    },
    {
        name: "Blur",
        property: "blur",
        value: 0,
        range: {
            min: 0,
            max: 20
        },
        unit: "px"
    }
]



const Filter = ({ file }) => {
    const [ options, setOptions ] = useState(DEFAULT_OPTIONS)
    const [ selectedOptionIndex, setSelectedOptionIndex ] = useState(0)
    const selectedOption = options[selectedOptionIndex]

    const handleSliderChange = (event) => {
        setOptions(preOptions => {
            return preOptions.map((option, index) => {
                if (index !== selectedOptionIndex) return option
                return { ...option, value: event.target.value }
            })
        })
    }

    const getImageStyle = () => {
        const filters = options.map(option => {
            return `${option.property}(${option.value}${option.unit})`
        })

        return { filter: filters.join(' ') }
    }


    return (
        <div>
            <img 
                id="original-image"
                width="100%" 
                src={file? URL.createObjectURL(file) : null} 
                alt={file? file.name : null}
                style={getImageStyle()}
            />

            <canvas 
                id="filtered-image" 
            />
            
            <br/><br/><br/>

            <div className='button-filter'>
                {options.map((option, index) => {
                    return(
                        <button key={index} type='button' className='btn btn-warning' onClick={() => setSelectedOptionIndex(index)}>
                            {option.name}
                        </button>
                    )
                })}
            </div>

            <input 
                type='range' 
                min={selectedOption.range.min}
                max={selectedOption.range.max}
                value={selectedOption.value}
                onChange={handleSliderChange}
            />
        </div>
        
    )
}



export default Filter