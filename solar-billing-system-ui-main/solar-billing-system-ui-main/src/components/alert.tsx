export const Alert = (props: { message: string, type: string }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                width: '50%',
                height: '50px',
                backgroundColor: props.type === 'success' ? 'green' : 'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                borderRadius: '15px'
            }}>
                <p>{props.message}</p>
            </div>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50px',
                height: '50px',
                backgroundColor: props.type === 'success' ? 'green' : 'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '15px'
            }}>
                <p onClick={() => {
                    window.location.reload()
                }}>X</p>
            </div>
        </div>
    )
}