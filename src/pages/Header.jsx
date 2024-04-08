
import { Menu, MenuItem, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
const Header = () => {
    const navigate = useNavigate()
    return (
        <>
            <Menu color='purple' inverted>
                <MenuItem
                    content={<Icon name='home' />}
                    onClick={() => navigate('/')}
                />
                <MenuItem
                    content={<Icon name='list layout' />}
                    onClick={() => navigate('/employees')}
                />
                <MenuItem
                    content={<Icon name='user plus' />}
                    onClick={() => navigate('/employees/add')}
                />
            </Menu>
        </>
    )
}
export default Header;