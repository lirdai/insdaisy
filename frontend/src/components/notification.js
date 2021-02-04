import React from 'react'



const Notification = ({ error, success }) => {
    return (
        <div>
            {error
                ? <div className="alert alert-danger">{ error }</div>
                : null
            }

            {success
                ? <div className="alert alert-success">{ success }</div>
                : null
            }
        </div>
    )
}



export default Notification