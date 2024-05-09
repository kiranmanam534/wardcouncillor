export const wardTitle = (wardType, title, isTownship = false) => {
  if (wardType == 'Outstanding') {
    if (title == 'D30_DAYS') {
      title = 'Outstanding 30 days';
    }
    if (title == 'D60_DAYS') {
      title = 'Outstanding 60 days';
    }
    if (title == 'D90_DAYS') {
      title = 'Outstanding 90 days';
    }
    if (title == 'D120_PLUS') {
      title = 'Outstanding 120+ days';
    }
  } else if (wardType == 'Interims') {
    if (!isTownship) {
      title = 'Category : ' + title + ' months';
    }
  }
  else if (wardType == 'Meter') {
    if (title==="EL") {
      title = `Electricity(${title})`;
    }else if (title==="WA") {
      title = `Water(${title})`;
    }
  }
  

  return title;
};

export const GetwardHeaderTitle = (wardType, title) => {
  if (wardType == 'Outstanding') {
    if (title == 'D30_DAYS') {
      title = 'Outstanding 30 days';
    }
    if (title == 'D60_DAYS') {
      title = 'Outstanding 60 days';
    }
    if (title == 'D90_DAYS') {
      title = 'Outstanding 90 days';
    }
    if (title == 'D120_PLUS') {
      title = 'Outstanding 120+ days';
    }
  } else if (wardType == 'Interims') {
    title = wardType + ' Categories';
  } else if (wardType == 'IMS') {
    title = wardType + ' Departments';
  }

  return title;
};

export const GetwardHeaderTownshipTitle = (wardType, title) => {
  if (wardType == 'Outstanding') {
    if (title == 'D30_DAYS') {
      title = 'Outstanding 30 days';
    }
    if (title == 'D60_DAYS') {
      title = 'Outstanding 60 days';
    }
    if (title == 'D90_DAYS') {
      title = 'Outstanding 90 days';
    }
    if (title == 'D120_PLUS') {
      title = 'Outstanding 120+ days';
    }
  } else if (wardType == 'Interims') {
    title = title + ' Townships';
  } else if (wardType == 'IMS') {
    title = title + ' Townships';
  }
  else if (wardType == 'Meter') {
    if (title==="EL") {
      title = `Electricity(${title}) Townships`;
    }else if (title==="WA") {
      title = `Water(${title}) Townships`;
    }
  }

  return title;
};

export const wardValue = (wardType, value) => {
  if (wardType == 'Interims') {
    return 'Customers : ' + value;
  } else if (wardType == 'IMS') {
    return 'No of incidents : ' + value;
  }
  else if (wardType == 'Meter') {
    return 'No of meters : ' + value;
  }
  else if (wardType == 'Property') {
    return 'No of properties : ' + value;
  }
  else if (wardType == 'Customer') {
    return 'No of customers : ' + value;
  }
  return value;
};
