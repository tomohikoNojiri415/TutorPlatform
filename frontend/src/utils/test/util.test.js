import { objectToQueryString } from '../util.js';  // Adjust the import path according to your project structure

describe('objectToQueryString with appointment object', () => {
  it('converts an appointment object to a query string', () => {

    const appointmentInfo = {
      tutorName: 'John Doe',
      course: 'MATH',
      rating: 5,
      location: 'Room 101',
      timeStart: null,
      timeEnd: null
    };

    const expectedQueryString = '?tutorName=John%20Doe&course=MATH&rating=5&location=Room%20101';
    const result = objectToQueryString(appointmentInfo);

    expect(result).toBe(expectedQueryString);
  });

  it('converts an empty appointment object to a query string', () => {

    const appointmentInfo = {
      tutorName: null,
      course: null,
      rating: null,
      location: null,
      timeStart: null,
      timeEnd: null
    };

    const expectedQueryString = '';
    const result = objectToQueryString(appointmentInfo);

    expect(result).toBe(expectedQueryString);
  });

});
