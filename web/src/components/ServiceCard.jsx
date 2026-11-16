import { Link } from 'react-router-dom';
import { useBackend } from '../lib/BackendContext';
import { Icon } from './Icons';

// CMS-aware service card — tag and card text can be overridden from the
// Content sheet via service.<id>.tag / service.<id>.card keys.
export default function ServiceCard({ service }) {
  const { content } = useBackend();
  const key = (f) => `service.${service.id}.${f}`;
  const tag = (content[key('tag')] || service.tag);
  const card = (content[key('card')] || service.card);
  return (
    <Link className="card" to={service.path}>
      <div className="card-img">
        <img src={service.image} alt={service.imageAlt} loading="lazy" />
      </div>
      <div className="card-body">
        <span className="tag">{tag}</span>
        <h3>{service.name}</h3>
        <p>{card}</p>
        <span className="more">
          Explore service <Icon name="arrowRight" />
        </span>
      </div>
    </Link>
  );
}
