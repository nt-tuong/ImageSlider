interface IMessageHelperIconProps {
  color?: string;
  strokeColor?: string;
}

const MessageHelperIcon = ({
    color = "#FFFFFF",
    strokeColor = "#272937",
}: IMessageHelperIconProps) => {
    return (
        <svg viewBox="0 0 154 38" preserveAspectRatio="none">
            <path
                d="M138.5 1C146.508 1 153 7.49187 153 15.5C153 23.3408 146.777 29.7267 139 29.9902V35.8438C139 36.695 138.004 37.1569 137.354 36.6074L129.545 30H15.5C7.49187 30 1 23.5081 1 15.5C1 7.49187 7.49187 1 15.5 1H138.5Z"
                fill={color}
                stroke={strokeColor}
            />
        </svg>
    );
};

export default MessageHelperIcon;
