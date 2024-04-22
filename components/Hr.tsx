// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Hr: React.FC<{ style: any }> = props => (
  <hr
    {...props}
    style={{
      border: '0px solid DimGray',
      borderBottomWidth: '1px',
      ...props.style
    }}
  />
)

export default Hr
