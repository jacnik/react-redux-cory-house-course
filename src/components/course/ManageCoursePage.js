import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import {authorsFormattedForDropdown} from '../../selectors/selectors';
import toastr from 'toastr';

export class ManageCoursePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            course: Object.assign({}, props.initialCourse),
            errors: {},
            saving: false
        };

        this.updateCourseState = this.updateCourseState.bind(this);
        this.saveCourse = this.saveCourse.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.initialCourse.id != nextProps.initialCourse.id) {
            this.setState({course: Object.assign({}, nextProps.initialCourse)});
        }
    }

    updateCourseState(event) {
        const field = event.target.name;
        let newCourse = Object.assign({}, this.state.course);
        newCourse[field] = event.target.value;
        return this.setState({course: newCourse});
    }

    courseFormValid() {
        let formIsValid = true;
        let errors = {};

        if(this.state.course.title.length < 5) {
            errors.title = 'Title must be at least 5 characters.';
            formIsValid = false;
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    saveCourse(event) {
        event.preventDefault();

        if(!this.courseFormValid()) {
            return;
        }

        this.setState({saving: true});
        this.props.actions
            .saveCourse(this.state.course)
            .then(() => this.redirect())
            .catch(error => {
                toastr.error(error);
                this.setState({saving: false});
            });
    }

    redirect() {
        this.setState({saving: false});
        toastr.success('Course saved');
        this.context.router.push('/courses');
    }

    render() {
        return (
            <CourseForm
                allAuthors={this.props.authors}
                onChange={this.updateCourseState}
                course={this.state.course}
                errors={this.state.errors}
                onSave={this.saveCourse}
                saving={this.state.saving}/>
        );
    }
}

ManageCoursePage.propTypes = {
    initialCourse: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

function getEmptyCourse() {
    return {
        id: '', watchHref: '', title: '', authorId: '', length: '', category: ''
    };
}

function getCourseById(courses, id) {
    const course = courses.filter(course => course.id === id);
    return course.length > 0 
        ? course[0] // .filter returns as array!
        : null;
}

// Pull in the Reacr Router context so router is avaiable
// on this.context.router.
ManageCoursePage.contextTypes = {
    router: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    const courseId = ownProps.params.id; // from the path 'course/:id'

    let course = courseId && state.courses.length > 0
        ? getCourseById(state.courses, courseId)
        : getEmptyCourse(); 
    
    return {
        initialCourse: course,
        authors: authorsFormattedForDropdown(state.authors)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(courseActions, dispatch)
    }; 
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);