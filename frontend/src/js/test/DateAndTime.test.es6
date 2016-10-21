import {FormattedDuration} from '../DateAndTime.es6'
import {shallow} from 'enzyme';
import {now} from 'moment';


const domDuration = (domElement) => {
  const dom = domElement.find('.buildDuration')
  console.log(dom.html())
  const dur = dom.childAt(1).html();
  return dur;
}

describe("Duration", ()=>{
      const expectDuration = (input, expectedOutput) => {
        let inputProps = {seconds: input}

        let component = shallow(FormattedDuration(inputProps));

        expect(component.text()).toEqual(expectedOutput)
      }

      it("should display only seconds if less than one minute", ()=>{
        expectDuration(2, "2 seconds");
        expectDuration(59,"59 seconds");
      })
      it("should display minutes in mm:ss format if less than one hour", ()=>{
        expectDuration(60, "1 minute")
        expectDuration(61, "1 minute 1 second");
        expectDuration(630, "10 minutes 30 seconds")
        expectDuration(600, "10 minutes");
      })

      const hours = int => int * 60 * 60;
      const minutes = int => int * 60;
      it("should display hours properly", ()=>{
        expectDuration(hours(1), "1 hour")
        expectDuration(hours(2)+ minutes(35) + 45, "2 hours 35 minutes 45 seconds")
      })
  })
