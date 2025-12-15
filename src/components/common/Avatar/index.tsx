import './index.css';

interface AvatarProps {
    url: string | null;
    size: number;
    name?: string;
    isOnline?: boolean;
    className?: string;
}

const Avatar = ({
    url,
    size,
    name = '',
    isOnline = false,
    className = ''
}: AvatarProps) => {
    // Lấy chữ cái đầu từ tên
    const getInitials = (name: string): string => {
        if (!name) return '?';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    // Tạo gradient color dựa trên tên
    const getGradientColor = (name: string): string => {
        if (!name) return 'from-gray-400 to-gray-600';
        const colors = [
            'from-blue-400 to-blue-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-red-400 to-red-600',
            'from-orange-400 to-orange-600',
            'from-yellow-400 to-yellow-600',
            'from-green-400 to-green-600',
            'from-teal-400 to-teal-600',
            'from-cyan-400 to-cyan-600',
            'from-indigo-400 to-indigo-600',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const initials = getInitials(name);
    const gradientClass = getGradientColor(name);

    return (
        <div className={`avatar-container ${className}`} style={{ width: size, height: size }}>
            {url ? (
                <img
                    src={url}
                    alt={name || 'Avatar'}
                    className="avatar-image"
                    style={{ width: size, height: size }}
                />
            ) : (
                <div
                    className={`avatar-placeholder bg-gradient-to-br ${gradientClass}`}
                    style={{ width: size, height: size, fontSize: size * 0.4 }}
                >
                    {initials}
                </div>
            )}
            {isOnline && (
                <div
                    className="avatar-online-indicator"
                    style={{
                        width: size * 0.25,
                        height: size * 0.25,
                        borderWidth: size * 0.05,
                    }}
                />
            )}
        </div>
    );
};

export default Avatar;