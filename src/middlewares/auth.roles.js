export const isAdminRole = (req, res, next) => {
  if (req.user.rol === "admin") {
    next();
  } else {
    res.send("no tienes permisos");
  }
};

export const isUsuarioRole = (req, res, next) => {
  if (req.user.rol === "usuario") {
    next();
  } else {
    res.send("no tienes permisos");
  }
};

export const checkRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "No tienes permisos de administrador",
      });
    }
    //obtener el rol del usuario
    const userRol = req.user.rol;
    if (!roles.includes(userRol)) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para esta accion",
      });
    }
    next();
  };
};
