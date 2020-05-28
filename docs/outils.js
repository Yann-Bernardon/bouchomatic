export default {
    // Clone un objet sans créer de lien
    clone: function(data) {
        return JSON.parse(JSON.stringify(data));
    },
    // Clone un objet et corrige son empreinte pour respecter un modèle (=forme du bouchon)
    nettoyer: function(data, modele) {
        let cloneData = JSON.parse(JSON.stringify(data));
        Object.keys(cloneData).forEach(cle => {
            if (!modele.hasOwnProperty(cle)) {
                delete cloneData[cle];
            }
        });

        return cloneData;
    }
};
