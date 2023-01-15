
const colors = new Map([
  ['HARD', 'text-red-900'],
  ['MEDIUM', 'text-amber-900'],
  ['EASY', 'text-green-900'],
]);

const bgs = new Map([
  ['HARD', 'bg-red-100'],
  ['MEDIUM', 'bg-amber-100'],
  ['EASY', 'bg-green-100'],
]);

export const WorkoutCard = ({ title, description, intensity }) => {

  return (
    <div className="backdrop-blur-md bg-gray-900 p-5 rounded-lg flex justify-between justify-items-center">
    <div>
      <p className="text-xl text-white mb-1">{title}</p>
      <p className="text-slate-300">{description}</p>
    </div>
    <div className='rounded-lg w-32'>
      <div className={`${colors.get(intensity)} ${bgs.get(intensity)} text-center rounded-2xl font-bold w-24`}>
      {intensity}      
      </div>
    </div>
    </div>
  )
}
