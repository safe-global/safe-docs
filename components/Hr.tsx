import { palette } from '../styles/palette'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Hr: React.FC<{ style?: any }> = props => (
  <hr
    {...props}
    style={{
      border: `0px solid ${palette.border.light}`,
      borderBottomWidth: '1px',
      ...props.style
    }}
  />
)

export default Hr
