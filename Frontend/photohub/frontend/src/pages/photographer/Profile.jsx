import { useAuth } from '../../context/AuthContext'
import { getPhotographerByUserId } from '../../data/mockData'
import RatingStars from '../../components/common/RatingStars'
import { formatCurrency, initials } from '../../utils/helpers'
import Badge from '../../components/common/Badge'

export default function PhotographerProfile() {
  const { user } = useAuth()
  const photographer = getPhotographerByUserId(user.user_id) || {
    experience: 0, bio: 'Add a bio to tell clients about your work.', location: '—', rating: 0, price_per_hour: 0, is_verified: false,
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center font-display text-xl font-bold">
          {initials(user.name)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold">{user.name}</h2>
            <Badge status={photographer.is_verified ? 'active' : 'pending'}>
              {photographer.is_verified ? 'Verified' : 'Pending review'}
            </Badge>
          </div>
          <p className="text-sm text-ink/60">{photographer.location}</p>
        </div>
      </div>
      <div className="card p-6 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-ink/50">Experience</span><span>{photographer.experience} yrs</span></div>
        <div className="flex justify-between"><span className="text-ink/50">Rate</span><span>{formatCurrency(photographer.price_per_hour)}/hr</span></div>
        <div className="flex justify-between items-center"><span className="text-ink/50">Rating</span><RatingStars value={photographer.rating} /></div>
      </div>
      <div className="card p-6">
        <p className="text-ink/50 text-sm mb-1">Bio</p>
        <p className="text-sm">{photographer.bio}</p>
      </div>
    </div>
  )
}
