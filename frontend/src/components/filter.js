import React, { useEffect, useState } from 'react'
import * as LenaJS from "lena.js"



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



const Filter = ({ file, setNewFile, setFilterRem }) => {
    // CSS FILTER
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

    const style_hidden = {
        display: 'none'
    }

    useEffect(() => {
        setFilterRem(getImageStyle().filter)
    }, [selectedOption])


    // ADVANCED FITLER 
    // img tag async, and canvas tag sync
    // Upload Image
    const [ newSrc, setNewSrc ] = useState(null)
    const [ filter, setFilter ] = useState(null)
    const originalImage = document.getElementById("original-image")
    const filteredImageCanvas = document.getElementById("filtered-canvas")
    
    const handleOnLoad = () => {
        if (filter) {
            LenaJS.filterImage(filteredImageCanvas, filter, originalImage)
            setNewSrc(filteredImageCanvas.toDataURL(file.type))

            filteredImageCanvas.toBlob(function(blob) {
                const new_file = new File([blob], file.name, {
                    type: "image/jpeg"
                })
                setNewFile(new_file)
            }, "image/jpeg", 0.5)
        }
    }

    // Add or Change Filter(filter or none)
    const handleAdvancedFilter = (event) => { 
        if (event.target.value !== "none") {
            setFilter(() => LenaJS[event.target.value])
        } else {
            setNewSrc(null)
            setFilter(null)
            setNewFile(null)
        }
    }


    return (
        <div>
            <img 
                id="original-image"
                src={file? URL.createObjectURL(file) : null} 
                alt={file? file.name : null}
                style={style_hidden}
                onLoad={handleOnLoad}
            />

            <img
                id="filtered-image"
                width="100%" 
                src={newSrc ? newSrc : (file ? URL.createObjectURL(file) : null)}
                alt={file? file.name : null}
                style={getImageStyle()}
            />

            <canvas 
                id="filtered-canvas" 
                style={style_hidden}
            />
            
            <br /><br /><br />

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

            <br /><br /><br />

            <h3>More advanced filter options...</h3>
            <select id="filter-changer" onChange={handleAdvancedFilter}>
                <option value="none">None</option>
                <option value="red">Red</option>
                <option value="gaussian">Gaussian</option>
                <option value="highpass">highpass</option>
                <option value="invert">invert</option>
                <option value="laplacian">laplacian</option>
                <option value="prewittHorizontal">Prewitt Horizontal</option>
                <option value="prewittVertical">Prewitt Vertical</option>
                <option value="roberts">roberts</option>
                <option value="sharpen">sharpen</option>
                <option value="sobelHorizontal">sobel Horizontal</option>
                <option value="sobelVertical">sobel Vertical</option>
                <option value="thresholding">thresholding</option>
            </select>
        </div>
    )
}



export default Filter