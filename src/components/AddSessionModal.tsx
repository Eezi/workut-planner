import { DateInput } from './Datepicker'

export const AddSessionModal = () => {

  return (
    <>
      <label htmlFor="my-modal-6" className="btn">open modal</label>


      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box h-3/4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-3">Select day for your workout</h3>
            <DateInput />
            </div>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">Create workout</label>
          </div>
        </div>
      </div>
    </>
  )
}
