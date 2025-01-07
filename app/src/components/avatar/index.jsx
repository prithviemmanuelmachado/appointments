import { ProfileAvatar } from "./index.style";

/**
 * Avatar Component
 * 
 * A reusable avatar component for displaying user profile images or initials.
 * If the `avatar` URL is provided, it renders the image; otherwise, it displays the `alt` text as initials.
 * 
 * @component
 * 
 * @param {Object} props - The properties for the Avatar component.
 * @param {string} props.avatar - The URL for the avatar image. If provided, the image will be displayed.
 * @param {string} props.alt - The text to display as initials or fallback if the avatar image is not available.
 * @param {string|number} props.size - The size of the avatar(Refer constants avatar size)
 * 
 * @example
 * // Rendering an avatar with an image
 * <Avatar 
 *   avatar="https://example.com/avatar.jpg" 
 *   alt="JD" 
 *   size={40} 
 * />
 * 
 * @example
 * // Rendering an avatar with initials
 * <Avatar 
 *   avatar={null} 
 *   alt="JD" 
 *   size={40} 
 * />
 * 
 * @returns {JSX.Element} A styled avatar component.
 */
export default function Avatar(props){
    const { avatar, alt, size } = props;

    return (
        <>
            <ProfileAvatar src={avatar} size={size}>
                {alt}
            </ProfileAvatar>
        </>
    );
}