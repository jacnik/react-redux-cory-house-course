import expect from 'expect';
import * as courseActions from './courseActions';
import * as types from './actionTypes';

import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

// Test a sync action
describe('Course Actions', () => {
    describe('createCourseSuccess', () => {
        it('Should create a CREATE_COURSE_SUCCESS action', () => {
            
            // arrange
            const course = {id: 'clean-code', title: 'Clean Code'};
            const expectedAction = {
                type: types.CREATE_COURSE_SUCCESS,
                course: course
            };

            // act
            const action = courseActions.createCourseSuccess(course);

            // assert
            expect(action).toEqual(expectedAction);
        });  
    });
});

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Async Actions', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('Should create BEGIN_AJAX_CALL and LOAD_COURSES_SUCCESS when loading courses', (done) => {
        /**
         * Example call to nock:
         * nock('http://example.com/')
         *  .get('/courses')
         *  .reply(200, { body: { course: [{ id: 1, firstName: 'Cory', lastName: 'House' }] }});
         */

        // arrange
        const expectedActions = [
            {type: types.BEGIN_AJAX_CALL},
            {type: types.LOAD_COURSES_SUCCESS, body: {courses: [{id: 'clean-code', title: 'Clean Code'}] }},
        ];
        const store = mockStore({courses: []}, expectedActions);

        // act
        store.dispatch(courseActions.loadCourses())
            .then(() => {
                // assert
                const actions = store.getActions();
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.LOAD_COURSES_SUCCESS);   
                done();
            }).catch(err => {
                expect(1).toEqual(0); // fail on error
                done();
            });
    });  
});
