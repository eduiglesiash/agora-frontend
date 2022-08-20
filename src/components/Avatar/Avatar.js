import './Avatar.css';
import { config } from '../../config/config'


export default function Avatar({ thumbnail, name }) {

  const generateURLImage = () => {
    if (thumbnail !== undefined && thumbnail.length > 0) {
      return config.strapi.production + thumbnail[0].url
    } else {
      return `${config.strapi.production}/uploads/user_icon_ce24812728.png`
    }
  }
  return (
    <picture className="Avatar">
      <img src={generateURLImage()} alt="" />
    </picture>
  )
}
