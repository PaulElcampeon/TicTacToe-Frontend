export default GameInfo = (props) => {
    return (
        <h1 className="text-white text-center mb-5 pb-5 titleTextSize specialFont">
            {props.info}
        </h1>
    )
}