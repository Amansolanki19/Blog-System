import { initials } from '../utils/format';

export default function Avatar({ firstName, lastName, username, profileImage, size = 'md', ...rest }) {
  const sizeClass = { sm: 'sm', md: 'md34', lg: 'lg', xl: 'xl' }[size] || '';
  return (
    <div className={`avatar ${sizeClass}`} {...rest}>
      {profileImage && <img src={profileImage} alt="" onError={(event) => event.currentTarget.remove()} />}
      {initials(firstName, lastName, username)}
    </div>
  );
}
