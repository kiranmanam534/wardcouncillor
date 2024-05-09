

export const getSelectedWardNoByType = (wardType, loggedUserWardNo, maylorSelectedWardNo) => {

    console.log(wardType, loggedUserWardNo, maylorSelectedWardNo)

    if (wardType === 'Outstanding') {
        if (loggedUserWardNo == 0) return maylorSelectedWardNo;
    }

    return loggedUserWardNo
}